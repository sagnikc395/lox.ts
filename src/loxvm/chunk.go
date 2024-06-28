package main

type OpCode = int

const (
	OP_RETURN OpCode = iota
)

type Chunk struct {
	code     []uint8
	count    int
	capacity int
}

func InitChunk() *Chunk {
	intialCapacity := 8 //8 bytes of memory
	return &Chunk{
		code:     make([]uint8, 0, intialCapacity),
		capacity: 0,
		count:    0,
	}
}

func (c *Chunk) writeChunk(b uint8) {
	if c.capacity < c.count+1 {
		oldcapacity := c.capacity
		c.code = append(c.code, uint8(c.capacity))
		c.capacity = growCapacity(oldcapacity)
	}

	c.code[c.count] = b
	c.count++
}

func growCapacity(capacity int) int {
	if capacity < 8 {
		return 8
	}
	return capacity * 2
}


